import services from "./../config/services";
import Connector from "./../helper/Connector";
import { DevCloud } from "./../";
import { PoolException, IdException } from "./../errors/General";
//used for communication with Customer service
export default class Customer {
  constructor(config = {}) {
    this.config = {
      person: {
        pool: getPersonPool(config.user)
      },
      opportunity: {
        pool: getOpportunityPool(config.user)
      },
      task: {
        pool: getTaskPool(config.user)
      }
    };
    return {
      person: this.person,
      opportunity: this.opportunity,
      task: this.task
    };
  }
  person = {
    /**
     * Promise
     * @param {boolean || string} pool
     * @return {Promise}
     */
    getAll: async (pool = false) => {
      if (pool === false) pool = this.config.person.pool;
      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/person/all",
        data: {
          pool
        }
      });
    },
    get: async (id, pool = false) => {
      if (pool === false) pool = this.config.person.pool;
      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/person/get",
        data: {
          id,
          pool
        }
      });
    },
    update: async (fields, id = false, pool = false) => {
      if (pool === false) pool = this.config.person.pool;
      if (!id) throw new IdException("Please set an id in Person.update()");
      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/person/update",
        data: {
          id,
          pool,
          ...fields
        }
      });
    }
  };
  opportunity = {
    getAll: async (pool = false) => {
      if (pool === false) pool = this.config.opportunity.pool;

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/all",
        data: {
          pool
        }
      });
    },
    get: async (id, pool = false) => {
      if (pool === false) pool = this.config.opportunity.pool;
      if (!id) throw new IdException("Please set an id in Opportunity.get()");

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/get",
        data: {
          id,
          pool
        }
      });
    },
    add: async (fields, pool = false) => {
      if (pool === false) pool = this.config.opportunity.pool;

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/add",
        data: {
          pool,
          ...fields
        }
      });
    },
    update: async (fields, id, pool = false) => {
      if (pool === false) pool = this.config.opportunity.pool;
      if (!id)
        throw new IdException("Please set an id in Opportunity.update()");
      if (fields.persons) {
        fields.persons.map(person => {
          if (!person.pool) person.pool = this.config.person.pool;
          return person;
        });
      }

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/update",
        data: {
          id,
          pool,
          ...fields
        }
      });
    },
    delete: async (id, pool = false) => {
      if (pool === false) pool = this.config.opportunity.pool;
      if (!id) {
        throw new IdException("Please set an id in Opportunity.delete()");
      }

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/delete",
        data: {
          id,
          pool
        }
      });
    },
    getPool: async (id = false) => {
      if (id === false) id = this.config.opportunity.pool;
      if (!id)
        throw new IdException("Please set an id in Opportunity.getPool()");

      const connector = new Connector(services.customer.address);
      return await connector.call({
        method: "POST",
        function: "/opportunity/pool/get",
        data: {
          id
        }
      });
    }
  };
  task = {
    timeClock: {
      add: async (start, end, pauses = [], pool = false) => {
        if (pool === false) pool = this.config.task.pool;
        const connector = new Connector(services.customer.address);
        return await connector.call({
          method: "POST",
          function: "/task/timeclock/add",
          data: {
            pool,
            start,
            end,
            pauses
          }
        });
      }
    }
  };
}
const getPersonPool = (config = {}) => {
  if (config.pool) return config.pool;
  const { customer } = DevCloud.getConfig().services;
  if (
    customer.person &&
    customer.person.pool &&
    customer.person.pool.length === 1
  ) {
    return customer.person.pool[0];
  } else {
    throw new PoolException("Pool could not be identified!");
  }
};
const getOpportunityPool = (config = {}) => {
  if (config.pool) return config.pool;
  const { customer } = DevCloud.getConfig().services;
  if (
    customer.opportunity &&
    customer.opportunity.pool &&
    customer.opportunity.pool.length === 1
  ) {
    return customer.opportunity.pool[0];
  } else {
    throw new PoolException("Pool could not be identified!");
  }
};
const getTaskPool = (config = {}) => {
  if (config.pool) return config.pool;
  const { customer } = DevCloud.getConfig().services;
  if (customer.task && customer.task.pool && customer.task.pool.length === 1) {
    return customer.task.pool[0];
  } else {
    throw new PoolException("Pool could not be identified!");
  }
};
